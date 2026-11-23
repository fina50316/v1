<?php
declare(strict_types=1);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
$host='127.0.0.1'; $dbname='kiwi_trails'; $username='root'; $password='';
try {
 $pdo=new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4",$username,$password,[
  PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES=>false
 ]);
} catch(PDOException $e) {
 http_response_code(500); header('Content-Type: application/json; charset=utf-8');
 echo json_encode(['success'=>false,'message'=>'資料庫連線失敗，請先匯入 database/kiwi_trails.sql。'],JSON_UNESCAPED_UNICODE); exit;
}
function json_response(array $data,int $status=200): never {
 http_response_code($status); header('Content-Type: application/json; charset=utf-8');
 echo json_encode($data,JSON_UNESCAPED_UNICODE); exit;
}
function request_data(): array {
 $data=json_decode(file_get_contents('php://input'),true); return is_array($data)?$data:$_POST;
}
function require_post(): void { if($_SERVER['REQUEST_METHOD']!=='POST') json_response(['success'=>false,'message'=>'不支援的請求方式。'],405); }
