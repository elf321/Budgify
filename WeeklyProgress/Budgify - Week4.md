Budgify - 4. Hafta İlerleme Raporu

Video Linki : https://drive.google.com/file/d/1lDnTWUqr8h23CwENbp0uHr6ISyw5oqG6/view?usp=sharing

Backend Repository: https://github.com/elf321/Budgify-Api

4. Hafta Yapılanlar

1. Transaction ve Category Modüllerinin Entegrasyonu:
Uygulamanın temel finans mantığını oluşturacak olan Transaction ve Category yönetimini tamamladım. 

2. Data Seeding ve Otomasyon (DataInitializer):
Uygulama ilk kurulumda kullanıcıya hazır bir içerik sunabilmesi adına CommandLineRunner interface'ini kullanarak bir DataInitializer kurguladım. 
Bu yapı, veritabanı boş olduğunda otomatik olarak Yemek, Ulaşım, Kira gibi temel kategorileri ikon ve renk kodlarıyla birlikte sisteme tanımlamaktadır.

3. Profesyonel DTO ve Mapper Akışı:
Veri gizliliğini korumak amacıyla TransactionDTO.Create ve TransactionDTO.View yapılarını oluşturdum. Backend tarafında, ham Entity nesnelerini direkt dışarı açmak yerine, sadece arayüzün ihtiyaç duyduğu verileri içeren View modellerini dönen bir Mapping mekanizması kurdum.

4. Frontend API Service Layer ve ApiClient:
React Native tarafında kod tekrarını önlemek ve merkezi bir yönetim sağlamak için apiClient yapısını kurdum.

5. Dinamik Form ve Arayüz Entegrasyonu (AddTransaction):
Harcama ekleme ekranını tamamen backend-driven bir yapıya kavuşturdum. Ekran açıldığında servis katmanı üzerinden kategorileri çekip, backend'den gelen renk kodlarını dinamik olarak arayüzde işleyen ve seçilen veriyi asenkron olarak kaydeden bir kullanıcı deneyimi sağladım.

Yapay Zeka Kullanımı (Gemini)

Mimari Re-naming ve Refactoring: DTO ve metot isimlendirmelerini (Request/Response yerine Create/View gibi) sektör standartlarına ve "Clean Code" prensiplerine uygun hale getirmek için yardım aldım.

Hata Ayıklama ve Port Yönetimi: Maven build süreçlerinde yaşanan derleme hatalarının çözümü ve 8080 portundaki işlem çakışmalarının giderilmesi için teknik destek aldım.

