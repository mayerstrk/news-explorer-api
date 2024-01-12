import { Request, Response, NextFunction } from 'express';
import { Status } from '../utils/enums/status';
import { AppRequest } from '../types/request';

type ControllerHelper = (
	request: AppRequest,
	response: Response,
) => Promise<{
	request: AppRequest;
	response: Response;
	data: unknown;
}>;

type ControllerBuilder = (
	controllerHelper: ControllerHelper,
) => (
	request: Request,
	responss: Response,
	next: NextFunction,
) => Promise<void>;

const controllerBuilder: ControllerBuilder = (controllerHelper) => {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			let data: unknown;
			({ response, request, data } = await controllerHelper(
				request as AppRequest,
				response,
			));
			response.status(Status.ok).send({ data });
		} catch (error) {
			next(error);
		}
	};
};

export default controllerBuilder;
export { ControllerHelper };
