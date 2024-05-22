import { getProdukList } from '../controller/ProdukController.js';
import {jest} from '@jest/globals'

describe('getProdukList test', () => {
    it('should return an array of products', async () => {
        const req = {};
        const res = {
            json: jest.fn(),
        };
        await getProdukList(req, res);
        console.log('Call count:', res.json.mock.calls.length);

        await getProdukList(req, res);
        expect(res.json).toHaveBeenCalled();
        expect(Array.isArray(res.json.mock.calls[0][0])).toBe(true);
    });
});
