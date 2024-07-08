process.env.NODE_ENV = "test"

const request = require("supertest");

const app = require("../app");
const db = require("../db");


describe("Test Books class", function () {
    let book;

    beforeEach(async function () {
        const result = await db.query(
           `INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
            VALUES (
                135791113,
                "https://www.temu.com/moby-dick",
                "Charles Dickens",
                "Chinese",
                971,
                "Panda Publishing",
                "Moby Dick",
                1833) 
            RETURNING  isbn, amazon_url, author, language, pages, publisher, title, year`
          );
      
        book = result.rows[0];
    });



    test("Test creating book", async function () {
        const response = await 
            request(app)
            .post(`/books`)
            .send({
                isbn: '123456789',
                amazon_url: "https://temu.com",
                author: "Saul T. Dawg",
                language: "Hebrew",
                pages: 315,
                publisher: "Salmon Pages",
                title: "Big Moves",
                year: 1971
              });
    
        expect(response.statusCode).toBe(201);
        expect(response.body.book).toHaveProperty("isbn");
    });


    test("Get books", async function() {
        const response = await request(app).get('/books');
        
        expect(response.body.books).toHaveLength(1);
        expect(response.body.books[0]).toHaveProperty('isbn');
    });
    

    test ("Get a book", async function() {
        const response = await request(app).get('/books/135791113');

        expect(response.body.book.isbn).toBe(book.isbn);
    });


    test ("Update a book", async function() {
        const response = await 
            request(app)
            .put('/books/135791113')
            .send({
                isbn: '123456789',
                amazon_url: "https://temu.com",
                author: "Saul T. Dawg",
                language: "Hebrew",
                pages: 315,
                publisher: "Salmon Pages",
                title: "Big Stretches",
                year: 1971
            });
        expect(response.body.book.title).toBe("Big Stretches");
    });


    test ("Delete a book", async function() {
        const response = await request(app).remove(`/books/${book.isbn}`);

        expect(response.body.books).toHaveLength(0);
    });


    
    afterEach(async function() {
        await db.query(`DELETE FROM books`);
        console.log("executed: DELETE FROM books");
    });  

    afterAll(async function() {
        await db.end();
    });
})