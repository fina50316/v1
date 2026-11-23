<?php
require __DIR__.'/database.php'; require_post(); $d=request_data();
$name=trim((string)($d['name']??$d['member_name']??'')); $email=strtolower(trim((string)($d['email']??'')));
$subject=trim((string)($d['subject']??$d['message_title']??'其他建議')); $content=trim((string)($d['content']??$d['message_content']??''));
if($name===''||!filter_var($email,FILTER_VALIDATE_EMAIL)||$subject===''||$content===''||mb_strlen($content)>5000) json_response(['success'=>false,'message'=>'請完整填寫留言資料。'],422);
$mid=$_SESSION['member']['member_id']??null;
$s=$pdo->prepare('INSERT INTO messages(member_id,member_name,email,subject,content) VALUES(?,?,?,?,?)');
$s->execute([$mid,$name,$email,$subject,$content]); json_response(['success'=>true,'message'=>'留言已成功送出，謝謝你的分享。']);
