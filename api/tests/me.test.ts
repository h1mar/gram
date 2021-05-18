import request from 'supertest';
import { app } from '../src/server';

describe('GET /me', function () {
	it('responds with json', function (done) {
		request(app)
			.get('/me')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});
