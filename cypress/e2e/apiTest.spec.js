describe('API automation', () => {
 beforeEach('Application login',()=>{
  cy.intercept('get',Cypress.env("apiUrl")+'/tags',{fixture:'tags.json'})
  cy.logintoApplication()
 })
  it('Verifying request and response', () => {
    cy.intercept('POST','https://conduit-api.bondaracademy.com/api/articles/').as('articlecreation')
   cy.contains('New Article').click()
   cy.get('[placeholder="Article Title"]').type('Test jas Article')
   cy.get('[formcontrolname="description"]').type('Test about Article')
   cy.get('[placeholder="Write your article (in markdown)"]').type('This is my actual article')
   cy.get('[placeholder="Enter tags"]').type('Jastest')
   cy.get('[type="button"]').click()
   cy.wait('@articlecreation').then(xhr=>{
   //cy.get('@articlecreation').then(xhr=>{
    console.log(xhr)
    expect(xhr.response.statusCode).to.equal(201)
    expect(xhr.response.body.article.title).to.equal('Test jas Article')
    expect(xhr.response.body.article.description).to.equal('Test about Article')
   })
  })

  it('Testing with mock API get response',()=>{
    //cy.wait('@tagsget')
   cy.get('[class="tag-list"]')
   .should('contain','Quality assurance')
   .and('contain','Test analyst')
   .and('contain','qa career')
  })

  it('Mocking API to verify the favourites',()=>{
   cy.intercept('GET','**/articles*',{fixture:'globalFeed.json'})
   cy.contains('Global Feed').click()
   cy.get('app-article-list button').then(heartList=>{
   expect(heartList[0]).to.contain('5')
   expect(heartList[1]).to.contain('10')
   expect(heartList[2]).to.contain('0')
   })
   cy.fixture('globalFeed.json').then(file=>{
    const slugid=file.articles[1].slug
    file.articles[1].favoritesCount=10
    cy.intercept('POST',Cypress.env("apiUrl")+'/articles/'+slugid+'/favorite',file)
    cy.get('app-article-list button').eq(1).click().should('contain','11')
   })
  })
 it.only('Deleting the article',()=>{
   const cred={
    "user": {
        "email": "jasmin@test.com",
        "password": "password"
    }
   }
   const bodyreq={
   "article": {
      "title": "Request from Postman",
      "description": "Test description for the article",
      "body": "Theis the body of teh test Article",
      "tagList": []
   }
   }
      cy.request('POST',Cypress.env("apiUrl")+'/users/login',cred)
   .its('body').then(body=>{
     const token=body.user.token
    
     cy.request({
      url:Cypress.env("apiUrl")+'/articles/',
      headers:{'Authorization':'Token '+token},
      method: 'POST',
      body: bodyreq
     }).then(response=>{
      expect(response.status).to.equal(201)
     })
     cy.contains('Global Feed').click()
     cy.wait(500)
     cy.get('app-article-list').first().click()
     cy.get('app-article-meta').contains(' Delete Article ').click()
     cy.wait(500)
     cy.request({
        url: Cypress.env("apiUrl")+'/articles',
        headers:{'Authorization':'Token '+token},
        method: 'GET'
     }).its('body').then(body=>{
     expect(body.articles[0].title).not.to.equal('Request from Postman')
   })
 })
})
})