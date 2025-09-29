import { createAuthClient } from "better-auth/client";
import { Button } from "./ui/button";

export default function SignUpForm() {
	const authClient = createAuthClient();

	const signIn = async () => {
		await authClient.signIn.social({
			provider: "google",
		});
	};

	return (
		<div className="mx-auto w-full mt-10 max-w-md p-6">
			<h1 className="mb-6 text-center text-3xl font-bold">Continue</h1>
			<Button
				onClick={signIn}
				variant="outline"
				size="lg"
				className="w-full gap-3"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 533.5 544.3"
					className="size-5"
					aria-hidden
				>
					<path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.2H272v95.1h147c-6.4 34.4-25.9 63.6-55.2 83.1v68h89.2c52.2-48.1 80.5-119 80.5-196z"/>
					<path fill="#34A853" d="M272 544.3c74.7 0 137.4-24.7 183.2-67.1l-89.2-68c-24.8 16.7-56.5 26.6-94 26.6-72 0-133.1-48.6-154.9-114.1H25.7v71.6C71.2 483.1 165.1 544.3 272 544.3z"/>
					<path fill="#FBBC05" d="M117.1 321.7c-10.9-32.8-10.9-68.3 0-101.1V149H25.7c-47.7 95.4-47.7 208.8 0 304.2l91.4-71.5z"/>
					<path fill="#EA4335" d="M272 107.7c40.6-.6 79.6 14.9 109.1 43.6l81.4-81.4C408.6 24.2 342 0 272 0 165.1 0 71.2 61.2 25.7 149l91.4 71.6C138.8 156.1 200 107.7 272 107.7z"/>
				</svg>
				<span className="font-medium">Continue with Google</span>
			</Button>
			<p className="mt-3 text-center text-xs text-muted-foreground">
				By continuing, you agree to our terms and privacy policy.
			</p>
		</div>
	);
}
