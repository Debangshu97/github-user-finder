import React from 'react';
import Showcase from '../layouts/Showcase';

import Users from '../users/search_users/Users';

const Home = ({search}) =>{

	return(
		<>
			<Showcase />
			{search && <Users/>}
			{/* <Users />  */}
			
		</>
	)

}

export default Home;