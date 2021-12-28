import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import AccountModal from "./components/AccountModal";
import EventList from "./components/EventList";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider>
      <div style={{  
          backgroundImage: "url(" + "https://styles.redditmedia.com/t5_4qfqv5/styles/backgroundImage_3dj67gwij6581.jpeg?format=pjpg&s=56fa4fde51b67695a02a173c4d8aae7be5053ab7" + ")",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}>
                  <EventList handleOpenModal={onOpen}/>
        <AccountModal isOpen={isOpen} onClose={onClose} />
        </div>

    </ChakraProvider>
  );
}

export default App;