import { createRoot } from "react-dom/client";
import {ReactDOM} from 'react'
import Wordle from './wordle';


const root = createRoot(document.getElementById("root"));
root.render(<Wordle />);