const axios = require('axios').default;
const express = require('express');

let Application = undefined;
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  validateStatus: (status) => status < 400
});

beforeAll(() => {

  const app = express();

  app.post('*', express.json(), (req, res) => {
    expect(req.body).toHaveProperty('fullname');
    expect(req.body).not.toHaveProperty(['name', 'surname']);
    res.json({ customerId: 123456789, uselessParam: 10 });
  });

  return new Promise((resolve, reject) => {
    Application = app.listen(5678, (err) => {
      if (err) return reject(err);
      resolve();
    });

  })
});

afterAll((done) => {
  Application.close(done);
})

describe('body modifier Policy', () => {
  it('should remove some properties and add some others when sending content', () =>
    axiosInstance
      .post('/', { name: 'Clark', surname: 'Kent' })
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
          customerId: 123456789,
          createdBy: 'Clark Kent'
        })
      })
  );
});

