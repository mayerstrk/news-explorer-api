import { Request, Response, NextFunction } from 'express';
import { Status } from '../utils/enums/status';
import { AppRequest } from '../types/request';
import { AppRequestVariant } from '../types/app-requests';

type ControllerHelper<T extends AppRequestVariant> = (
	request: AppRequest<T>,
	response: Response,
) => Promise<{
	request: AppRequest<T>;
	response: Response;
	data: unknown;
}>;

type ControllerBuilder = <T extends AppRequestVariant>(
	controllerHelper: ControllerHelper<T>,
) => (
	request: Request,
	responss: Response,
	next: NextFunction,
) => Promise<void>;

const controllerBuilder: ControllerBuilder = <T extends AppRequestVariant>(
	controllerHelper: ControllerHelper<T>,
) => {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			let data: unknown;
			({ response, request, data } = await controllerHelper(
				request as AppRequest<T>,
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
