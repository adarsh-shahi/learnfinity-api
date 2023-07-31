import { NextFunction, Request, Response } from "express";
import qs from "qs";

const googleOAuth = async (req: Request, res: Response, next: NextFunction) => {
	const code = req.query.code;

	const url = `https://oauth2.googleapis.com/token`;

	const values = {
		code,
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: process.env.GOOGLE_REDIRECT_URI,
		grant_type: "authorization_code",
	};

	console.log(qs.stringify(values));
	try {
		const response = await fetch(`${url}?${qs.stringify(values)}`, {
			method: "post",
			headers: {
				"Content-Type": "application/x-www-form-urlencoding",
			},
		});
		const data: any = await response.json();
		const { id_token, access_token } = data;

		// get google user
		//1) in id token you will have all the details of google user just decode it
		// const googleUser = jwt.decode(id_token)

		//2) or you can send these ids to client(website) and from there m a http request and then get all google user details

		const googleUserData = await fetch(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
			{
				headers: {
					Authorization: `Bearer ${id_token}`,
				},
			}
		);

		const googleUser = await googleUserData.json();

		console.log(googleUser);
		const sendUserData = {
			email: googleUser.email,
			name: googleUser.name,
			picture: googleUser.picture,
		};

		res
			.status(200)
			.redirect(
				`http://localhost:3000?jsonData=${encodeURIComponent(
					JSON.stringify(sendUserData)
				)}`
			);
	} catch (error: any) {
		console.log(error);
		res.status(400).send("wrong");
	}
};

export { googleOAuth };
