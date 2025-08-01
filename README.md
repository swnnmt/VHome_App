thêm brand
{
  "name": "Sơn MyKolor",
  "banner": "https://example.com/images/mykolor-banner.jpg",
  "paints": [
    { "colorCode": "#FF5733", "price": 120000 },
    { "colorCode": "#FF5733", "price": 140000 },
    { "colorCode": "#FF5733", "price": 150000 }
  ],
  "tiles": [
    { "image": "/tiles/gach-viglacera-vvgp8803.jpg", "price": 180000 },
    { "image": "/tiles/gach-viglacera-vvgp8805.jpg", "price": 190000 },
    { "image": "/tiles/gach-viglacera-vvgp8806.jpg", "price": 170000 },
    { "image": "/tiles/gach-viglacera-sh1-gp4801.jpg", "price": 280000 },
    { "image": "/tiles/gach-viglacera-sh1-gp4801a.jpg", "price": 220000 }
    
  ]
}

API_URL=http://14.225.192.87
API_URL=http://10.0.2.2

uvicorn app:app --reload --host 0.0.0.0 --port 8001


chạy server
 cd ~/Server
pm2 start server.js --name vhome-server
// restart
pm2 restart vhome-server

// kiểm tra trạng thái 
pm2 status



chạy backend 
cd backend
pm2 start uvicorn --name vhome-ai --interpreter python3 -- \
  app:app --host 0.0.0.0 --port 8001
// restart
pm2 restart vhome-ai


chạy front end 
scp -r "D:\Project\VHome\vhome-web\build\*" root@14.225.192.87:/var/www/vhome-frontend

kiểm tra cấu hình nginx
 sudo nginx -t

sudo systemctl restart nginx
sudo systemctl status nginx