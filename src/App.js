import { ChakraProvider, Container, Divider, Flex, Grid, Link } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import './App.css';
import m3 from './assets/notification-tone.mp3';
import SearchByDistrict from './components/SearchByDistrict';
import SessionByDistrict from './components/SessionByDistrict';

let audio = new Audio(m3);

function App() {
	const [sessions, setSessions] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	const fetchLocationsByDistrict = (district_id, date, ageRestriction) => {
		var intervalId = setInterval(async ()=>{
			try {
				setIsSearching(true);
				const { data } = await axios.get(
					`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${date}`
				);
				if (data.sessions.length > 0) {
					if (
						ageRestriction !== 'Any' &&
						data.sessions.find(
							(session) =>
								String(session.min_age_limit) === ageRestriction
						)
					) {
						audio.play();
						clearInterval(intervalId);
						setIsSearching(false);
						setSessions(data.sessions);
					}
					if (ageRestriction === 'Any') {
						audio.play();
						clearInterval(intervalId);
						setIsSearching(false);
						setSessions(data.sessions);
					}
				}
			} catch (error) {
				console.log('none found');
			}
		}, 5000);
	};

	return (
		<ChakraProvider>
			<Container maxW='container.md' paddingTop={10}>
				<SearchByDistrict
					fetchLocationsByDistrict={fetchLocationsByDistrict}
					isSearching={isSearching}
				/>
			</Container>
			<Grid
				templateColumns='repeat(auto-fit, minmax(300px,350px))'
				gap={2}
				width='100%'
				justifyContent='center'
				padding='8'
			>
				{sessions.map((session, i) => (
					<>
						{i !== 0 && <Divider />}
						<SessionByDistrict {...session} />
					</>
				))}
			</Grid>
			<Flex justify="center" padding={5}>
			<Link href="https://itsmehul.github.io" isExternal>Made with ♥ by Mehul</Link>
			</Flex>
		</ChakraProvider>
	);
}

export default App;
