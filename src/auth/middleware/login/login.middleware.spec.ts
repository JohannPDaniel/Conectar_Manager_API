import { NextFunction, Request, Response } from 'express';
import { LoginMiddleware } from './login.middleware';

describe('LoginMiddleware', () => {
  const createSut = () => new LoginMiddleware();

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

  it('Deve retornar 400 quando o e-mail não for fornecido', () => {
    const sut = createSut();

    req.body = { email: '' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo (email) é obrigatório !!!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando a senha não for fornecido', () => {
    const sut = createSut();

    req.body = { email: 1 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo (senha) é obrigatório !!!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando o e-mail for fornecido com um tipo diferente de string', () => {
    const sut = createSut();

    req.body = { email: 1, password: 2 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo (email) de vir em formato de texto !!!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando a senha for fornecida com um tipo diferente de string', () => {
    const sut = createSut();

    req.body = { email: '1', password: 2 };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo (senha) de vir em formato de texto !!!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando o e-mail for fornecido com um formato diferente de e-mail: ****@****.com', () => {
    const sut = createSut();

    req.body = { email: 'ab@ab.com', password: '2' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message:
        'O e-mail informado deve estar em um formato de E-mail ****@****.com',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 400 quando a senha tiver menos que 4 caracteres', () => {
    const sut = createSut();

    req.body = { email: 'abcd@email.com', password: 'abc' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'O atributo (senha) deve ter no mínimo 4 caracteres !!!',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
