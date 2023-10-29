const fs = require('fs');
const WebSocket = require('ws');

const keywords = {
    'лес': ['https://all-aforizmy.ru/wp-content/uploads/2022/07/1920x1200_1411196_www.artfile.ru_.jpg', 
            'https://sportishka.com/uploads/posts/2022-03/1648055170_25-sportishka-com-p-krasivii-yelovii-les-turizm-krasivo-foto-68.jpg', 
            'https://catherineasquithgallery.com/uploads/posts/2023-02/1676618296_catherineasquithgallery-com-p-fon-khvoinii-les-40.jpg'],
    'озеро': ['https://urgi-stv.ru/wp-content/uploads/6/f/7/6f75d076ae71e0032ff3391b32c020c5.jpeg', 
            'https://urgi-stv.ru/wp-content/uploads/8/1/4/8145261fd89e5bfbbb23068ffcc632d5.jpeg', 
            'https://vsegda-pomnim.com/uploads/posts/2022-03/1647290511_2-vsegda-pomnim-com-p-ozero-seidozero-foto-2.jpg'],
    'река': ['http://s2.fotokto.ru/photo/full/727/7270705.jpg', 
            'https://a.d-cd.net/fc0702ds-1920.jpg', 
            'https://class-tour.com/wp-content/uploads/0/4/d/04d9fa9e3d7b438c5b71794d4dc9e5b2.jpeg'],
    'гора': ['https://oir.mobi/uploads/posts/2020-04/1586450006_27-p-gori-khibini-44.jpg', 
            'https://photocentra.ru/images/main78/786973_main.jpg', 
            'http://s2.fotokto.ru/photo/full/345/3457582.jpg'],  
  // Другие ключевые слова с соответствующими URL
};

let MAX_CONCURRENT_THREADS = 1; 
fs.readFile('config.txt', 'utf8', function(err, data) {
  if (!err) {
    MAX_CONCURRENT_THREADS = Number(data);
    console.log('MAX_CONCURRENT_THREADS set to', MAX_CONCURRENT_THREADS);
  } else {
    console.error('Failed to read config.txt:', err);
  }
}); 

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('Client connected');
  let threadCount = 0; 

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const urls = keywords[message];
    if (threadCount < MAX_CONCURRENT_THREADS) {
      threadCount++;

      if (urls) {
        socket.send(JSON.stringify(urls));
      } else {
        socket.send(JSON.stringify(new String('empty')));
      }

      console.log('Started stream');
    } else {
      console.log('Maximum concurrent streams reached');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log("Server started on port 8080");
