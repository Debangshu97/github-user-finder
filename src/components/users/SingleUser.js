import React,{useEffect,useState} from 'react';
import axios from 'axios';
import Spinner from '../layouts/Spinner';
import RepositoryCard from "../repos/RepositoryCard";



let githubClientId;
let githubClientSecret;

if(process.env.NODE_ENV !== 'production'){
	githubClientId = process.env.REACT_APP_GITHUB_CLIEND_ID;
	githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
}else{
	githubClientId = process.env.GITHUB_CLIEND_ID;
	githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const SingleUser = ({match}) => {
	const [user_data,set_user_data] = useState({});
	const [repos,set_repos] = useState([]);
	const [user_response_loading,set_user_loading] = useState(false);
	const [repos_response_loading,set_repos_loading] = useState(false);

	  const [sortType, setSortType] = useState('');


	//fetch login from url
	const login = match.params.login;

	useEffect(() => {
		set_user_loading(true);
		set_repos_loading(true);
		const fetchData = async () =>{
			const user_response = await axios.get(`https://api.github.com/users/${login}?client_id=${githubClientId}&client_secret=${githubClientSecret}`);
			const repos_response = await axios.get(`https://api.github.com/users/${login}/repos?client_id=${githubClientId}&client_secret=${githubClientSecret}`);
			(user_response.data) && set_user_loading(false);
			(repos_response.data) && set_repos_loading(false);
			set_user_data(user_response.data);	
			set_repos(repos_response.data);	
		}

		fetchData();
		//eslint-disable-next-line
	},[])

	const handleSortChange = (event) => {
    setSortType(event.target.value);
	

  };

  const sortResults = () => {
    const sortedResults = [...repos];
	console.log(sortedResults);

    if (sortType === 'stars') {
      sortedResults.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortType === 'forks') {
      sortedResults.sort((a, b) => b.forks_count - a.forks_count);
    }

    set_repos(sortedResults);
  };

	const {avatar_url,name,bio,followers,following,public_repos,html_url} = user_data
	return(
		<React.Fragment>
			<div className="user">
				{user_response_loading && <Spinner />}
				{!(user_response_loading) && 
					<React.Fragment>
						<div className="user_img">
							<img src={avatar_url} alt="github user gravatar" />
						</div>
						<ul className="user_info">
							<li className="user_info-name"><span className="profile_text">Name: </span>{name}</li>
							{bio && <li className="user_info-bio"><span className="profile_text">Bio: </span>{bio}</li>}
							<div className="user_info-container">
								<li className="user_info-followers">followers: {followers}</li>
								<li className="user_info-following">following: {following}</li>
								<li className="user_info-repos">Public Repositories: {public_repos}</li>
							</div>
							<a href={html_url} target="_blank" rel=" noopener noreferrer" className="button button_dark">Visit Github Profile</a>
						</ul>
					</React.Fragment>
				}
			</div>
			<div className="user">
				{repos_response_loading && <Spinner />}
				{!(repos_response_loading) &&
					<React.Fragment> 
						<ul className="main_cards-block" style={{paddingTop:'0px',width:'100%'}}>
						<h2 style={{textAlign:'center',marginBottom:'10px'}}><span className="profile_text">Repositories <span>
							 <label htmlFor="sort">Sort by:</label>
        <select id="sort" 
		style={{backgroundColor: '#f2f2f2',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px',
    fontSize: '16px',
    width: '100px',
marginLeft:'5px'}}
		value={sortType} onChange={handleSortChange}>
          <option value="">None</option>
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
        </select>
		<button style={{backgroundColor: '#4CAF50',
  border: 'none',
  color: 'white',
  marginLeft:'5px',
  padding: '7px 8px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  borderRadius:'3px'}} onClick={sortResults}>Sort</button>
		</span></span>
						
						</h2>
							{repos.map(repo => <RepositoryCard key={repo.id} repo={repo} />)}
						</ul>
					</React.Fragment>
				}
			</div>
		</React.Fragment>
	)

}

export default SingleUser;