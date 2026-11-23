<?php
require __DIR__.'/database.php'; require_post(); $d=request_data();
$email=strtolower(trim((string)($d['email']??''))); $password=(string)($d['password']??'');
$s=$pdo->prepare('SELECT member_id,name,email,password_hash FROM members WHERE email=? LIMIT 1'); $s->execute([$email]); $m=$s->fetch();
if(!$m||!password_verify($password,$m['password_hash'])) json_response(['success'=>false,'message'=>'電子郵件或密碼錯誤。'],401);
unset($m['password_hash']); session_regenerate_id(true); $_SESSION['member']=$m;
json_response(['success'=>true,'message'=>'登入成功。','member'=>$m]);
