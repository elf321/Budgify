Budgify - 8. Hafta İlerleme Raporu

Backend Repository: https://github.com/elf321/Budgify-Api

8. Hafta Videosu: https://drive.google.com/file/d/1R893kn_KvvQWe3DaSrZnZFFZhzKCpXNC/view?usp=sharing

- Global Oturum ve Durum Yönetimi (AuthContext Architecture):
Uygulamanın güvenlik ve kullanıcı altyapısı için global AuthContext yapısını kurdum. Tüm uygulamayı AuthProvider ile sarmalayarak, login olan kullanıcının gerçek userId bilgisini merkezi bir state'te topladım ve tüm ekranların erişimine açtım.

- Merkezi API İstemcisi ve Ortak Servis Yönetimi (apiClient Implementation):
Dağınık fetch isteklerini ve kod tekrarlarını önlemek amacıyla merkezi bir apiClient yapısı tasarladım. get ve post isteklerini ortak hata yönetimiyle tek merkezde toplayarak, authService dahil tüm servisleri ve Authorization header yönetimini bu sisteme entegre ettim.

- Dinamik Veri Akışı ve Statik Kod Temizliği (Dynamic Context Binding):
Uygulama genelinde test amaçlı kullanılan sabit userId = 1 bağımlılıklarını tamamen kaldırdım. MainTabNavigator üzerinden Overview, Target, AddTransaction ve Budget ekranlarına context'ten gelen gerçek kullanıcı id'sinin dinamik olarak aktarılmasını sağladım.

- Wallet Ekranı ve Kullanıcı Deneyimi Optimizasyonu (UI/UX Completion):
Kullanıcı giriş butonuna asenkron işlemler için loading durumu ekledim. Budget sekmesini yeniden popüler "My Wallet" görünümüne bağlayarak; toplam bakiye, gelir/gider özeti, harcama ilerlemesi ve son işlemler bileşenlerini gerçek kullanıcı verileriyle asenkron çalışacak şekilde optimize ettim.

- Test Altyapısı ve Mock Konfigürasyonları (Jest & Unit Test Integration):
React Navigation ve alt paketlerin Jest ortamında kararlı çalışması için jest.config.js konfigürasyonunu güncelledim. jest.setup.js dosyasını oluşturarak gesture-handler ve navigation kütüphanelerini mock'ladım; böylece root render testlerinin hatasız çalışmasını sağladım.
