<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama = htmlspecialchars($_POST['nama']);
    $email = htmlspecialchars($_POST['email']);
    $pesan = htmlspecialchars($_POST['pesan']);

    $to = "gatauuu518@gmail.com";
    $subject = "Pesan Baru dari Form Hubungi Kami";
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "Content-Type: text/plain; charset=UTF-8";

    $body = "Nama: $nama\n";
    $body .= "Email: $email\n";
    $body .= "Pesan:\n$pesan";

    if (mail($to, $subject, $body, $headers)) {
        echo "<h2>Pesan Anda telah berhasil dikirim!</h2>";
    } else {
        echo "<h2>Gagal mengirim pesan. Silakan coba lagi.</h2>";
    }
} else {
    echo "<h2>Akses tidak diizinkan.</h2>";
}
?>
