import { NextFunction, Response } from 'express';
import { CustomRequest } from '../../../types';
import { JWT } from '../../../utils';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  const jwtMock = {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
  } as JWT;

  const req = {
    headers: {
      authorization: '',
    },
  } as CustomRequest;

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

  const createSut = () => new AuthMiddleware(jwtMock);

  it('Deve retornar 401 quando não for fornecido um header authorization', () => {
    const sut = createSut();

    req.headers.authorization = '';

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Token não autenticado',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 401 quando o formato do token for diferente de BEARER <token>', () => {
    const sut = createSut();

    req.headers.authorization = 'Fake-Token';

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Formato do token inválido! Use (Bearer <token>).',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 401 quando o token não for do tipo JWT', () => {
    const sut = createSut();

    req.headers.authorization = 'Bearer abc';

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Usuário não autenticado!',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
