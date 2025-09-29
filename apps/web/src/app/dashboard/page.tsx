"use client";

import SignInForm from "@/components/sign-in-form";

import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
} from "convex/react";

export default function DashboardPage() {

	return (
		<>
			<Authenticated>
				<div>
					<h1>Dashboard</h1>
				</div>
			</Authenticated>
			<Unauthenticated>
				<SignInForm />
			</Unauthenticated>
			<AuthLoading>
				<div>Loading...</div>
			</AuthLoading>
		</>
	);
}
