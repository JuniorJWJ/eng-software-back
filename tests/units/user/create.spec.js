const User = require("../../../src/model/User");
const UserController = require("../../../src/controllers/UserController");

describe("CreateUser", () => {
  const req = {
    body: {
      name: "Teste",
      email: "teste@email.com",
      password: "teste123",
      file: "string",
    }
  };

  const res = {
    status: 0
  };

  // beforeAll(() => {
  //   jest.spyOn(User.prototype, "create").mockImplementation(async () => {
  //     return null
  //   });

  //   jest.spyOn(UserController.prototype, "create").mockImplementation(async () => {
  //     return {
  //       erro: false,
  //       mensagem: "User cadastrado com sucesso!",
  //     }
  //   });
  // });

  test("Should create a user", async () => {
    const result = await UserController.create(req, res)

    expect(result).toStrictEqual({
      erro: false,
      mensagem: "User cadastrado com sucesso!",
    })
  });
});
