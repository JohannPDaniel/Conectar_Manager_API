import { NextFunction, Request, Response } from 'express';
import { createUserMiddleware } from './createUser.middleware';

describe('UsersMiddleware', () => {
  const createSut = () => new createUserMiddleware();

  const jsonMock = jest.fn();
  const statusMock = jest.fn().mockImplementation(() => ({
    json: jsonMock,
  }));

  const req = {
    body: {},
  } as Request;

  const res = {
    status: statusMock,
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar 400 quando o nome não for fornecido', () => {
    const sut = createSut();

    req.body = { name: '' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo "name" é obrigatório!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando o e-mail não for fornecido', () => {
    const sut = createSut();
    const req = {
      body: { name: 1 },
    } as Request;

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo "email" é obrigatório!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando a senha não for fornecida', () => {
    const sut = createSut();

    req.body = { name: 1, email: 2 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo "password" é obrigatório!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando a permissão não for fornecida', () => {
    const sut = createSut();

    req.body = { name: 1, email: 2, password: 3 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo "permissão" é obrigatório!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando o nome for de um tipo diferente de uma string', () => {
    const sut = createSut();

    req.body = { name: 1, email: 2, password: 3, role: 4 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo "name" deve ser um texto!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando o e-mail for de um tipo diferente de uma string', () => {
    const sut = createSut();

    req.body = { name: '1', email: 2, password: 3, role: 4 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo "email" deve ser um texto!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando a senha for de um tipo diferente de uma string', () => {
    const sut = createSut();

    req.body = { name: '1', email: '2', password: 3, role: 4 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'O atributo "senha" deve ser um texto!',
      success: false,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando a permissão for de um tipo diferente de uma string', () => {
    const sut = createSut();

    req.body = { name: '1', email: '2', password: '3', role: 4 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'O atributo "permissão" deve ser do tipo (ADMIN) ou (USER)',
      success: false,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando o nome tiver menos que 4 caracteres', () => {
    const sut = createSut();

    req.body = { name: 'abc', email: '2', password: '3', role: 'user' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'O atributo "name" deve ter no mínimo 4 caracteres !!!',
      success: false,
    });
  });

  it('Deve retornar 400 quando o nome tiver menos que 4 caracteres', () => {
    const sut = createSut();

    req.body = { name: 'abc', email: '2', password: '3', role: 'user' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'O atributo "name" deve ter no mínimo 4 caracteres !!!',
      success: false,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando o e-mail não estiver escrito em formato de e-mail: ****@****.com', () => {
    const sut = createSut();

    req.body = {
      name: 'Johann',
      email: 'ab@ab.com',
      password: '3',
      role: 'user',
    };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message:
        'O e-mail informado deve estar em um formato de E-mail ****@****.com',
      success: false,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando a senha tiver menos que 4 caracteres', () => {
    const sut = createSut();

    req.body = {
      name: 'Johann',
      email: 'abcd@email.com',
      password: 'abc',
      role: 'user',
    };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'O atributo "senha" ter no mínimo 4 caracteres!',
      success: false,
    });

    expect(next).not.toHaveBeenCalled();
  });
});
