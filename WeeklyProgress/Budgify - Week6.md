Budgify - 6. Hafta İlerleme Raporu

Backend Repository: https://github.com/elf321/Budgify-Api

6. Hafta Videosu: https://drive.google.com/file/d/13OYDoHROP309kJ-VtNuJ0iA4vFZf1jQ5/view?usp=share_link

Gelişmiş Finansal Dashboard (Overview Screen):
Uygulamanın veriye dayalı analiz merkezi olan "Overview" ekranını geliştirdim. Bu ekran, kullanıcının finansal durumunu sadece rakamlarla değil, görsel trendlerle de takip edebilmesini sağlıyor. Toplam bakiye, gelir ve gider akışını merkezi bir yapıda topladım.
Dinamik Gelir/Gider Trend Grafiği (DailyTrendChart):
Kullanıcının haftalık veya aylık periyotlardaki para akışını gözlemleyebilmesi için bir "Bar Chart" yapısı kurdum. Gelirleri yeşil, giderleri kırmızı sütunlarla yan yana getirerek kullanıcının hangi dönemde daha fazla harcama yaptığını görsel olarak analiz etmesini sağladım.
Kategori Bazlı Harcama Dağılımı (Donut Chart):
Harcamaların hangi kategorilerde (Market, Eğitim, Fatura vb.) yoğunlaştığını gösteren bir pasta grafik (Donut Chart) geliştirdim. Kütüphane kullanmadan, tamamen özel CSS ve matematiksel hesaplamalarla (Pie Slice logic) oluşturulan bu grafik, bütçe disiplini için kullanıcıya kritik bir veri sunuyor.
Esnek Zaman Filtreleme (Period Toggle):
Uygulama genelindeki verilerin tek bir dokunuşla "Haftalık" veya "Aylık" bazda filtrelenmesini sağlayan bir mekanizma kurdum. Bu filtreleme, sadece listeleri değil, grafiklerdeki veri setlerini ve toplam hesaplamaları da (useMemo ile optimize edilmiş şekilde) anlık olarak güncelliyor.
