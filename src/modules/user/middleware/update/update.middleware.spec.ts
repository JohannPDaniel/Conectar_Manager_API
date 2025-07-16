import { NextFunction, Request, Response } from 'express';
import { UpdateMiddleware } from './update.middleware';

describe('UpdateMiddleware', () => {
  const createSut = () => new UpdateMiddleware();

  const req = {
    body: {},
  } as Request;

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

  it('Deve retornar 400 se o nome, quando vier for diferente de um formato de texto', () => {
    const sut = createSut();

    req.body = { name: true };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo nome deve vir em formato de texto !!!',
    });
  });

  it('Deve retornar 400 se o e-mail, se vier estiver em formato de e-mail: ****@****.com', () => {
    const sut = createSut();

    req.body = { name: 'abc', email: true };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message:
        'O atributo e-mail deve vir em formato de e-mail: ****@****.com !!!',
    });
  });

  it('Deve retornar 400 se a senha, se vier for diferente de um formato de texto', () => {
    const sut = createSut();

    req.body = { name: 'abc', email: 'email@email.com', password: true };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo senha deve vir em formato de texto !!!',
    });
  });

  it('Deve retornar 400 se o nome, se vier, tiver menos que 4 caracteres', () => {
    const sut = createSut();

    req.body = { name: 'abc', email: 'email@email.com', password: 'abc' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo nome deve ter no minimo 4 caracteres !!!',
    });
  });

  it('Deve retornar 400 se a senha, se vier, tiver menos que 4 caracteres', () => {
    const sut = createSut();

    req.body = { name: 'Johann', email: 'email@email.com', password: 'abc' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo senha deve ter no minimo 4 caracteres !!!',
    });
  });
});
