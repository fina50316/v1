<?php
require __DIR__ . '/php/database.php';
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) { http_response_code(404); exit('找不到這則消息。'); }
$stmt = $pdo->prepare('SELECT title,category,summary,content,image,published_at FROM news WHERE news_id=? AND is_published=1');
$stmt->execute([$id]);
$news = $stmt->fetch();
if (!$news) { http_response_code(404); exit('找不到這則消息。'); }
function e($value) { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html>
<html lang="zh-TW">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($news['title']) ?>｜KIWI TRAILS</title>
<link href="css/bootstrap.min.css" rel="stylesheet"><link href="css/style.css" rel="stylesheet"><link href="css/pages.css" rel="stylesheet">
</head>
<body>
<main class="page-section"><div class="container">
<a href="news.html">← 返回最新消息</a>
<p class="eyebrow"><?= e($news['category']) ?> · <?= e($news['published_at']) ?></p>
<h1><?= e($news['title']) ?></h1>
<?php if (!empty($news['image'])): ?><img class="img-fluid my-4" src="<?= e($news['image']) ?>" alt=""><?php endif; ?>
<p><?= nl2br(e($news['summary'])) ?></p>
<article><?= nl2br(e($news['content'])) ?></article>
</div></main>
<script src="js/bootstrap.bundle.min.js"></script>
</body></html>