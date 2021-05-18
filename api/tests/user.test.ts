import request from 'supertest';
import { app } from '../src/server';

describe('GET /user', function () {
	it('responds with json', function (done) {
		request(app)
			.get('/user/a61bf9d5-100f-4b76-8e4f-cc20b76d44d3')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});
