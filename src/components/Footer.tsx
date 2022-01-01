import React from "react";
import GitHubButton from 'react-github-btn';
import { Flex, Spacer, Box, Image, Text } from '@chakra-ui/react';

const Footer = () => (
    <div className="footer">
        <Flex>
            <Box w="530px">
                <GitHubButton href="https://github.com/DFKReports">Follow @DFKReports</GitHubButton>
            </Box>
            < Spacer />
            <Box w="530px">
                <Text>Created by Beecass and Schnitsel for DFK Bounty</Text>
            </Box>
            < Spacer />
            <Box w='30px'>
                <Image boxSize='28px'
                    objectFit='cover' alt="JEWEL" src={require("../assets/dfk_logo.png")} />
            </Box>
            <Box w="500px">
                <Text><b>Tip Jar: 0xF766e04E8a7DEC3006e30D3aA4607c2eCaBf08a6</b></Text>
            </Box>

        </Flex>
    </div>
);

export default Footer;