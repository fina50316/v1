<?php
require __DIR__.'/database.php'; require_post();
if(empty($_SESSION['member']['member_id'])) json_response(['success'=>false,'message'=>'請先登入會員再建立訂單。'],401);
$d=request_data(); $items=$d['items']??[];
if(!is_array($items)||count($items)===0||count($items)>50) json_response(['success'=>false,'message'=>'購物車沒有有效商品。'],422);
try {
 $pdo->beginTransaction(); $validated=[]; $total=0;
 foreach($items as $item) {
  $id=(int)($item['productId']??$item['product_id']??0); $qty=max(1,min(20,(int)($item['quantity']??1)));
  if($id>0) { $q=$pdo->prepare('SELECT product_id,name,price FROM products WHERE product_id=? AND is_active=1'); $q->execute([$id]); $p=$q->fetch(); if(!$p) throw new RuntimeException('商品不存在或已下架。'); $name=$p['name']; $price=(float)$p['price']; $pid=(int)$p['product_id']; }
  else { $name=trim((string)($item['name']??'')); $price=(float)($item['price']??0); $pid=null; if($name===''||$price<0||$price>10000000) throw new RuntimeException('商品資料不正確。'); }
  $date=$item['experienceDate']??$item['experience_date']??null; if($date==='') $date=null;
  if($date!==null && !preg_match('/^\d{4}-\d{2}-\d{2}$/',$date)) throw new RuntimeException('體驗日期格式錯誤。');
  $validated[]=[$pid,$name,$price,$qty,$date]; $total+=$price*$qty;
 }
 $no='KT'.date('ymdHis').random_int(100,999);
 $q=$pdo->prepare("INSERT INTO orders(order_no,member_id,total_amount) VALUES(?,?,?)");
 $q->execute([$no,$_SESSION['member']['member_id'],$total]); $oid=(int)$pdo->lastInsertId();
 $q=$pdo->prepare('INSERT INTO order_items(order_id,product_id,product_name,unit_price,quantity,experience_date) VALUES(?,?,?,?,?,?)');
 foreach($validated as $v) $q->execute([$oid,...$v]);
 $pdo->commit(); json_response(['success'=>true,'message'=>'展示訂單建立成功，沒有進行付款或實際預約。','order_no'=>$no,'total'=>$total]);
} catch(Throwable $e) { if($pdo->inTransaction()) $pdo->rollBack(); json_response(['success'=>false,'message'=>$e instanceof RuntimeException?$e->getMessage():'訂單建立失敗。'],422); }
