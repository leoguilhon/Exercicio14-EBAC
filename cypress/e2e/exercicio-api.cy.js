/// <reference types="cypress" />

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
         cy.token('beltrano@qa.com.br', 'teste').then(tkn => { token = tkn })
     });
     it('Deve validar contrato de usuários', () => {
          //TODO: 
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let numero = `${Math.floor(Math.random() * 100000000)}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Usuário" + numero,
                    "email": "emailteste" + numero + "@gmail.com",
                    "password": "teste",
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(token, "Teste", "beltrano@qa.com.br", "teste", "true")
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let numero = `${Math.floor(Math.random() * 100000)}`
          cy.cadastrarUsuario(token, "Usuário" + numero, "usuario" + numero + "@qa.com.br", "teste", "true")
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body:
                         {
                              "nome": "Nome Alterado " + numero,
                              "email": "emailalterado" + numero + "@gmail.com",
                              "password": "senha",
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let numero = `${Math.floor(Math.random() * 100000)}`
          cy.cadastrarUsuario(token, "Usuário" + numero, "usuario" + numero + "@qa.com.br", "teste", "true")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })
     });
})
