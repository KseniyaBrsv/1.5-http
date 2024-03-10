const http = require('http');
const readline = require('node:readline');

//const { myAPIKey, CITY } = require('./config');
const { myAPIKey, CITY } = process.env;

const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

const url = `http://api.weatherstack.com/current?access_key=${myAPIKey}`;
  rl.question(`Укажите название города, для которого требуется вывести прогноз: \n`, (answer) => {
    http.get(`${url}&query=${answer}`, (res) => {
      const {statusCode} = res;
      if (statusCode !== 200) {
        console.log(`statusCode: ${statusCode}`);
        return;
      };
      res.setEncoding('utf8');
      let rowData = '';
      res.on('data', (chunk) => rowData += chunk);
      res.on('end', () => {
        let parseData = JSON.parse(rowData);
        if(parseData.success !== false) {
          console.log('Прогноз погоды для населенного пункта', parseData.location.name);
          console.log('---------------');
          console.log('Температура:', parseData.current.temperature);
          console.log('Краткое описание:', parseData.current.weather_descriptions);
          console.log('Скорость ветра:', parseData.current.wind_speed);
        } else console.log('Ваш запрос не выполнен. Пожалуйста, попробуйте еще раз или обратитесь в службу поддержки.');
      });
    }).on('error', (err) => {
      console.error(err);
    })
    rl.close();
  });
