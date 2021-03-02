require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });
    const todo = {
      todo: 'wash car',
      completed: false
    };
    const dbTodo = {
      ...todo,
      user_id: 2,
      id: 4
    };
    test('creates new todo', async() => {

      const todo = {
        todo: 'wash car',
        completed: false,

      };

      const data = await fakeRequest(app)
        .post('/api/todos')
        .send(todo)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(dbTodo);
    });
  });
});
