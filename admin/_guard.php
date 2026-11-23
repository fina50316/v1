<?php
require __DIR__.'/../php/database.php';
if (empty($_SESSION['member']) || ($_SESSION['member']['role'] ?? '') !== 'admin') {
 http_response_code(403); exit('請先以管理員帳號登入。請參考 README-112302.md 設定管理員權限。');
}
function h($v){return htmlspecialchars((string)$v,ENT_QUOTES,'UTF-8');}
function admin_start($title){
 echo '<!doctype html><html lang="zh-TW"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'.h($title).'｜KIWI TRAILS 後台</title><link href="../css/bootstrap.min.css" rel="stylesheet"><body class="bg-light"><main class="container py-4"><h1>KIWI TRAILS 管理後台</h1><nav class="mb-4 d-flex flex-wrap gap-3"><a href="index.php">總覽</a><a href="messages.php">留言</a><a href="members.php">會員</a><a href="products.php">商品</a><a href="orders.php">訂單</a><a href="news.php">消息</a><a href="../index.html">返回網站</a></nav><h2>'.h($title).'</h2>';
}
function admin_end(){echo '</main></body></html>';}
