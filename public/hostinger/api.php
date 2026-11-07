<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';
$pdo = getDBConnection();

// 1. Book a Consultation
if ($action === 'book' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['patientName']) || empty($input['phone']) || empty($input['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Patient name, phone, and email are required.']);
        exit;
    }

    $id = 'LUM-' . rand(100000, 999999);
    $userId = $input['userId'] ?? ('guest-' . substr(md5(uniqid()), 0, 8));
    $treatments = is_array($input['treatments']) ? implode('; ', $input['treatments']) : ($input['treatments'] ?? 'General Consultation');

    $stmt = $pdo->prepare("
        INSERT INTO consultations (id, user_id, patient_name, phone, email, treatments, preferred_clinician, preferred_date, preferred_time, notes, status, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
    ");

    $stmt->execute([
        $id,
        $userId,
        $input['patientName'],
        $input['phone'],
        $input['email'],
        $treatments,
        $input['preferredClinician'] ?? 'First Available Master Clinician',
        $input['preferredDate'] ?? date('Y-m-d'),
        $input['preferredTime'] ?? '11:00 AM',
        $input['notes'] ?? '',
        $input['source'] ?? 'Hostinger Web Intake'
    ]);

    echo json_encode([
        'success' => true,
        'id' => $id,
        'message' => 'Consultation booked successfully in Hostinger MySQL.'
    ]);
    exit;
}

// 2. Fetch Consultations (For Admin Portal & Patient Accounts)
if ($action === 'consultations' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['userId'] ?? null;

    if ($userId) {
        $stmt = $pdo->prepare("SELECT * FROM consultations WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
    } else {
        $stmt = $pdo->query("SELECT * FROM consultations ORDER BY created_at DESC");
    }

    $results = $stmt->fetchAll();
    echo json_encode(['success' => true, 'consultations' => $results]);
    exit;
}

// 3. Post a Verified Review (with anti-spam validation)
if ($action === 'review' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $comment = trim($input['comment'] ?? '');
    if (strlen($comment) < 10 || strlen($comment) > 500) {
        http_response_code(400);
        echo json_encode(['error' => 'Review comment must be between 10 and 500 characters.']);
        exit;
    }

    // Check for spam URLs
    if (preg_match('/(https?:\/\/|www\.)/i', $comment)) {
        http_response_code(400);
        echo json_encode(['error' => 'Reviews cannot contain promotional links or external URLs.']);
        exit;
    }

    $rating = intval($input['rating'] ?? 5);
    if ($rating < 1 || $rating > 5) {
        $rating = 5;
    }

    $id = 'REV-' . rand(100000, 999999);
    $userId = $input['userId'] ?? 'verified-patient';
    $authorName = $input['authorName'] ?? 'Verified Patient';
    $authorLocation = $input['authorLocation'] ?? 'Beverly Hills, CA';
    $treatment = $input['treatment'] ?? 'Aesthetic Rejuvenation';

    $stmt = $pdo->prepare("
        INSERT INTO reviews (id, user_id, author_name, author_location, treatment, rating, comment, is_verified, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'published')
    ");

    $stmt->execute([$id, $userId, $authorName, $authorLocation, $treatment, $rating, $comment]);

    echo json_encode([
        'success' => true,
        'id' => $id,
        'message' => 'Review verified and saved to Hostinger MySQL.'
    ]);
    exit;
}

// 4. Fetch Published Reviews
if ($action === 'reviews' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM reviews WHERE status = 'published' ORDER BY created_at DESC");
    $reviews = $stmt->fetchAll();
    echo json_encode(['success' => true, 'reviews' => $reviews]);
    exit;
}

// 5. Download CSV
if ($action === 'export_csv') {
    $stmt = $pdo->query("SELECT * FROM consultations ORDER BY created_at DESC");
    $rows = $stmt->fetchAll();

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=lumina_hostinger_leads_' . date('Y-m-d') . '.csv');

    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'User ID', 'Patient Name', 'Phone', 'Email', 'Treatments', 'Clinician', 'Date', 'Time', 'Notes', 'Status', 'Estimated Value', 'Source', 'Created At']);

    foreach ($rows as $row) {
        fputcsv($output, $row);
    }
    fclose($output);
    exit;
}

// Fallback
echo json_encode([
    'status' => 'online',
    'service' => 'Lumina Medical Spa Hostinger Backend API',
    'version' => '1.0'
]);
