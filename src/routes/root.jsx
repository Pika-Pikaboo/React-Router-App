import React, { useEffect } from 'react';
import {
	NavLink,
	Outlet,
	useLoaderData,
	Form,
	redirect,
	useNavigation,
	useSubmit
} from 'react-router-dom';
import { getContacts, createContact } from '../contacts.js';

export async function loader({ request }) {
	const url = new URL(request.url);
	const queue = url.searchParams.get("queue");
	const contacts = await getContacts(queue);
	return { contacts, queue };
}

export async function action() {
	const contact = await createContact();
	return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
	const { contacts, queue } = useLoaderData();
	const navigation = useNavigation();
	const submit = useSubmit();

	let activeStyle = {
		backgroundImage: "linear-gradient(to bottom right, cyan, skyblue, rgb(253, 52, 243))"
	};

	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).has("queue");

	useEffect(() => {
		document.getElementById("queue").value = queue;
	}, [queue]);

	return (
		<React.Fragment>
				<div id="sidebar">
		        <h1>React Router Contacts</h1>
		        <div>
		          <Form id="search-form" role="search">
		            <input
		              id="queue"
		              aria-label="Search contacts"
		              placeholder="Search"
		              type="search"
		              name="queue"
		              defaultValue={queue}
		              className={searching ? "loading" : ""}
		              onChange={(event) => {
		              	const isFirstSearch = queue === null;
		              	submit(event.currentTarget.form, {
		              		replace: !isFirstSearch,
		              	});
		              }}
		            />
		            <div
		              id="search-spinner"
		              aria-hidden
		              hidden={!searching}
		            />
		            <div
		              className="sr-only"
		              aria-live="polite"
		            ></div>
		          </Form>
		          <Form method="post">
		            <button type="submit">New</button>
		          </Form>
		        </div>
		        <nav>
		        {contacts.length ? (
	            <ul>
	              {contacts.map((contact) => (
	                <li key={contact.id}>
	                  <NavLink to={`contacts/${contact.id}`}
	                  	style={({isActive}) => isActive ? activeStyle : undefined}
	                  >
	                    {contact.first || contact.last ? (
	                     <>
	                        {contact.first} {contact.last}
	                     </>
	                    ) : (
	                     <i>No Name</i>
	                    )}{" "}
	                    {contact.favorite && <span>★</span>}
	                  </NavLink>
	                </li>
	              ))}
	            </ul>
	          	) : (
	            <p>
	              <i>No contacts</i>
	            </p>
	          	)}
		       </nav>
		      </div> 
		      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
		      	<Outlet/>
		      </div> 
		</React.Fragment>
	);
}
