const request = require('request')
var base_url = "http://localhost:8080/"

describe('cal',()=>{
    it('should multiply 2 and 2',()=>{
        expect(2*2).toBe(4)
    })
})

describe('Get messages',() => {
    it('Should return 200 ok', (done)=>{
        request.get(base_url+"messages", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            done()
          });
    })
    it('Should return a list thats not empty', (done)=>{
        request.get(base_url+"messages", (error, response, body) => {
            expect(JSON.parse(body).length).toBeGreaterThan(0);
            done()
          });
    })
})

describe('Get messages from user',() => {
    it('Should return 200 ok', (done)=>{
        request.get(base_url+"messages/tim", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            done()
          });
    })
    
    it('name should be tim', (done)=>{
        request.get(base_url+"messages/tim", (error, response, body) => {
            expect(JSON.parse(body)[0].name).toEqual('tim');
            done()
          });
    })
})
