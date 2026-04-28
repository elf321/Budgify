Budgify - 5. Hafta İlerleme Raporu

Backend Repository: https://github.com/elf321/Budgify-Api

Cüzdan Tasarımı (My Wallet): Uygulamanın ana ekranı olan "My Wallet" bölümünü tamamladım. 
Bu ekranda toplam bakiye, aylık harcama limiti analizi ve gelir/gider özet kartlarını kullanıcıya sunan bir dashboard yapısı kurdum.

Progress Bar: Kullanıcının aylık harcamasını gelirine oranlayan dinamik bir ilerleme çubuğu entegre ettim. 
Bu sayede bütçe kontrolünü görsel bir metriğe bağladım.

Gelir/Gider Ayrıştırma Mantığı: "New Transaction" ekranını güncelleyerek harcama ve gelir girişlerini tek bir ekranda, "Segmented Control" yapısıyla ayrıştırdım. 
Backend tarafındaki CategoryType yapısını frontend arayüzüne (Expense için Kırmızı, Income için Yeşil teması) tam uyumlu hale getirdim.

Kategori Bazlı İşlem Listeleme: "Recent Transactions" bölümünde her işlemin kategorisine göre ikon ve renk kodlarıyla listelenmesini sağlayarak, 
kullanıcının harcama geçmişini bir bakışta analiz edebileceği bir akış oluşturdum.

Asenkron Veri Yönetimi: Form üzerindeki kategori seçimlerini ve kayıt işlemlerini servis katmanı üzerinden backend ile senkronize ederek kullanıcı deneyimini optimize ettim.

Yapay Zeka Kullanımı (Gemini)

UI/UX Karar Destek: Gelir ve gider ekranları arasındaki geçiş mantığının kurulması ve renk paletinin finansal standartlara göre optimize edilmesi konusunda destek aldım.

Veri Formatlama ve Hesaplama: Dashboard üzerindeki "Total Balance" ve "Monthly Spending %" gibi verilerin frontend tarafında doğru formatta (TL simgesi, yüzde hesaplama) işlenmesi için gerekli logic yapılarını Gemini ile kurguladım.
