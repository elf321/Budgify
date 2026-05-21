Budgify - 7. Hafta İlerleme Raporu

Backend Repository: https://github.com/elf321/Budgify-Api

7. Hafta Videosu: https://drive.google.com/file/d/10U-KTSikhbFfGrNQv2rUCoQu9reep0UR/view?usp=share_link

-Bütçe ve Hedef Yönetimi Altyapısı (Backend Target Architecture):
Uygulamaya bütçe disiplini kazandırmak amacıyla "Target" (Hedef) mekanizmasını kurdum. Kullanıcıların hem genel aylık harcama limitleri hem de kategori bazlı (Market, Giyim, Fatura vb.) özel bütçe hedefleri koyabilmesini sağlayan veri modelini (Target Entity) ve TargetType enum yapısını hayata geçirdim.

-Gelişmiş İş Mantığı ve Dinamik Durum Hesaplama (TargetService):
Frontend üzerindeki yükü azaltmak ve uygulama performansını artırmak amacıyla, bütçe ilerleme hesaplamalarını tamamen backend katmanında kurguladım. Kullanıcının içinde bulunduğu aya ait harcamalarını (Transaction), belirlediği aktif hedeflerle eşleştirerek; harcanan tutar, kalan bütçe ve ilerleme yüzdesi (progress percentage) verilerini dinamik olarak üreten algoritmayı tamamladım.

-Kurumsal DTO Standardı (Static Inner Class Architecture):
Projedeki dosya kalabalığını önlemek ve veri transfer nesnelerini (DTO) daha okunabilir kılmak adına kurumsal standartlara uygun Static Inner Class yapısını bütçe modülüne uyguladım. TargetDTO.Create ve TargetDTO.StatusView yapılarını tek bir çatı altında toplayarak temiz ve sürdürülebilir bir kod mimarisi elde ettim.

-Kalıcı Veri Yönetimi (Database DDL Optimization):
Geliştirme ortamında veritabanının her yeniden başlatmada sıfırlanmasını önlemek adına Hibernate ddl-auto yapılandırmasını update moduna optimize ettim. Böylece mevcut finansal verileri koruyarak yeni targets tablosunun veritabanına pürüzsüzce entegre olmasını sağladım.

-Bağımsız Target Ekranı Entegrasyonu (Frontend UI/UX Completion):
Uygulamanın ana footer (Tab Bar) yapısında yer alan "Target" sekmesini tamamen işlevsel hale getirdim. Backend API'den gelen dinamik ilerleme yüzdelerini ve bütçe durumlarını frontend tarafında karşılayarak, kullanıcının bütçe limitlerini anlık olarak takip edebileceği görsel bir akış tasarladım.
