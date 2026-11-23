<?php
require __DIR__.'/database.php'; require_post(); $d=request_data();
$name=trim((string)($d['name']??'')); $email=strtolower(trim((string)($d['email']??''))); $password=(string)($d['password']??'');
if($name===''||mb_strlen($name)>50||!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($password)<6) json_response(['success'=>false,'message'=>'請確認姓名、電子郵件及至少 6 碼密碼。'],422);
try {
 $s=$pdo->prepare('INSERT INTO members(name,email,password_hash) VALUES(?,?,?)');
 $s->execute([$name,$email,password_hash($password,PASSWORD_DEFAULT)]);
 session_regenerate_id(true); $_SESSION['member']=['member_id'=>(int)$pdo->lastInsertId(),'name'=>$name,'email'=>$email];
 json_response(['success'=>true,'message'=>'註冊成功，已自動登入。','member'=>$_SESSION['member']]);
} catch(PDOException $e) { if($e->getCode()==='23000') json_response(['success'=>false,'message'=>'此電子郵件已註冊。'],409); json_response(['success'=>false,'message'=>'註冊失敗。'],500); }
