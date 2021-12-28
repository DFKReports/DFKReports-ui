import axios from 'axios';
import React, { useState } from "react";
import moment from "moment";
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config } from '@usedapp/core'
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import { Center, Heading, Flex, Spacer, Box, Image, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Button,
    AccordionIcon,
} from '@chakra-ui/react'

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react'

import ConnectButton from "./ConnectButton";

type Props = {
    handleOpenModal: any;
};

interface Event {
    contract_name: string;
    transaction_gasfee: number;
    price: number;
    timestamp: number;
}

interface Record {
    events: [Event];
    event_type: string;
    total_sum: number;
}

export default function EventList({ handleOpenModal }: Props) {

    const { activateBrowserWallet, account } = useEthers()


    const [income, setIncome] = React.useState([]);
    const [expenses, setExpenses] = React.useState([]);
    const [totalIncome, setTotalIncome] = React.useState(0.0);
    const [totalExpenses, setTotalExpenses] = React.useState(0.0);
    const [endDate, setEndDate] = React.useState<Date | null>(new Date());
    const [startDate, setStartDate] = React.useState<Date | null>(new Date());

    function getEventsForWallet() {
        let baseurl = `http://127.0.0.1:8080/events/${account}/`
        axios.get(baseurl)
            .then(response => {
                setIncome(response.data.income);
                setExpenses(response.data.outcome);
                setTotalIncome(response.data.total_income);
                setTotalExpenses(response.data.total_outcome);
                console.log(response);
            });

    }

    return account ? (
        <Box justifyContent="top"
            alignItems="center"
            minHeight="100vh"
        >
            <Box bg="#d99559" w='100%' p={4}>
                <Flex>
                    <Box w='70px'>
                        <Image boxSize='50px'
                            objectFit='cover' alt="JEWEL" src={require("../assets/dfk_logo.png")} />
                    </Box>
                    <Box w='390px'>
                        <Heading as='h2' size='2xl'> DFK Reports</Heading>
                    </Box>
                    <Box w="300px" p='3px' m='2px' borderWidth='1px' borderRadius='lg' borderColor='black'>
                        <Text>Select Start Date</Text>
                        <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
                    </Box>
                    <Box w="300px" p='3px' m='2px' borderWidth='1px' borderRadius='lg' borderColor='black'>
                        <Text>Select End Date</Text>
                        <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} />
                    </Box>
                    <Box p='3px' m='2px'>
                        <Button p='3px' variant='outline' onClick={getEventsForWallet}>
                            Search Transactions
                        </Button>
                    </Box>
                    <Spacer />
                    <Box>
                        <ConnectButton handleOpenModal={handleOpenModal} />
                    </Box>
                </Flex>

            </Box>
            <Box bg="white" w='99%' m={2} borderRadius='lg'>
                <Tabs isFitted variant='enclosed'>
                    <TabList color="black">
                        <Tab>Income: {totalIncome} $</Tab>
                        <Tab>Expenses: {totalExpenses} $</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {income.map((record: Record) => (
                                <Accordion sx={{ bgcolor: "#b0b0b0", m: 1}} allowToggle>
                                    <AccordionItem borderStyle='hidden'>
                                        <h2>
                                            <AccordionButton borderRadius='lg' bgColor='#b0b0b0'>
                                                <Box flex='1' textAlign='left'>
                                                    <Text><b>{record.event_type}</b></Text>

                                                </Box>
                                                <Text><u>Total:</u> {Math.round(record.total_sum * 100) / 100} $</Text>
                                                <AccordionIcon w="65px" />
                                            </AccordionButton>
                                        </h2>

                                        <AccordionPanel pb={4}>
                                            <Table variant='striped' size='sm'>
                                                <Thead sx={{ bgcolor: "#d99559", m: 1 }}>
                                                    <Tr>
                                                        <Th width='15%'>TimeStamp</Th>
                                                        <Th with='20%'>Item</Th>
                                                        <Th width='10%'>Price</Th>
                                                        <Th width='30%'>Transaction Hash</Th>
                                                        <Th width='15%'>Transaction Gas Fee</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {record.events.map((event: Event) => (
                                                        <Tr>
                                                            <Td component="th" scope="row" width="20%">
                                                                {moment.unix(event.timestamp).format('lll')}
                                                            </Td>
                                                            <Td align="left">{event.contract_name}</Td>
                                                            <Td align="left">{event.price} $</Td>
                                                            <Td></Td>
                                                            <Td align="right">{event.transaction_gasfee}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>

                                        </AccordionPanel>
                                    </AccordionItem>


                                </Accordion>
                            ))}
                        </TabPanel>
                        <TabPanel>
                        {expenses.map((record: Record) => (
                                <Accordion sx={{ bgcolor: "#b0b0b0", m: 1}} allowToggle>
                                    <AccordionItem borderStyle='hidden'>
                                        <h2>
                                            <AccordionButton borderRadius='lg' bgColor='#b0b0b0'>
                                                <Box flex='1' textAlign='left'>
                                                    <Text><b>{record.event_type}</b></Text>

                                                </Box>
                                                <Text><u>Total:</u> {Math.round(record.total_sum * 100) / 100} $</Text>
                                                <AccordionIcon w="65px" />
                                            </AccordionButton>
                                        </h2>

                                        <AccordionPanel pb={4}>
                                            <Table variant='striped'>
                                                <Thead sx={{ bgcolor: "#d99559", m: 1 }}>
                                                <Tr>
                                                        <Th width='15%'>TimeStamp</Th>
                                                        <Th with='20%'>Item</Th>
                                                        <Th width='10%'>Price</Th>
                                                        <Th width='30%'>Transaction Hash</Th>
                                                        <Th width='15%'>Transaction Gas Fee</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {record.events.map((event: Event) => (
                                                        <Tr>
                                                            <Td component="th" scope="row" width="20%">
                                                                {moment.unix(event.timestamp).format('lll')}
                                                            </Td>
                                                            <Td align="left">{event.contract_name}</Td>
                                                            <Td align="left">{event.price} $</Td>
                                                            <Td></Td>
                                                            <Td align="right">{event.transaction_gasfee}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>

                                        </AccordionPanel>
                                    </AccordionItem>


                                </Accordion>
                            ))}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    ) : (
        <Box minHeight="100vh">
            <Box justifyContent="top"
                alignItems="center"

            >
                <Box bg="#d99559" w='100%' p={4}>
                    <Flex>
                        <Box w='70px'>
                            <Image boxSize='50px'
                                objectFit='cover' alt="JEWEL" src={require("../assets/dfk_logo.png")} />
                        </Box>
                        <Box w='390px'>
                            <Heading as='h2' size='2xl'> DFK Reports</Heading>
                        </Box>
                        <Spacer />
                        <Box>
                            <ConnectButton handleOpenModal={handleOpenModal} />
                        </Box>
                    </Flex>

                </Box>
            </Box>
            <Box>
                <Center bg="#d99559" h='100px' color='white' m='150px'>
                    Connect to Metamask to get started
                </Center>
            </Box>
        </Box>
    );

}