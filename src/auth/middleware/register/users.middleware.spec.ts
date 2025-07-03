import { NextFunction, Request, Response } from 'express';
import { createUserMiddleware } from './createUser.middleware';

describe('UsersMiddleware', () => {
  const createSut = () => new createUserMiddleware();

  const jsonMock = jest.fn();
  const statusMock = jest.fn().mockImplementation(() => ({
    json: jsonMock,
  }));

  const res = {
    status: statusMock,
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar 400 quando o nome não for fornecido', () => {
    const sut = createSut();
    const req = {
      body: { name: '' },
    } as Request;

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
    const req = {
      body: { name: 1, email: 2 },
    } as Request;

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
    const req = {
      body: { name: 1, email: 2, password: 3 },
    } as Request;

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
    const req = {
      body: { name: 1, email: 2, password: 3, role: 4 },
    } as Request;

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
    const req = {
      body: { name: '1', email: 2, password: 3, role: 4 },
    } as Request;

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
    const req = {
      body: { name: '1', email: '2', password: 3, role: 4 },
    } as Request;

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'O atributo "senha" deve ser um texto!',
      success: false,
    });

    expect(next).not.toHaveBeenCalled();
  });
});
