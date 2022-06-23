import { reactive } from 'vue'
import axios from "axios";

export default function useMediaService() {
    const allMediaCategory = reactive({});
    const allMedia = reactive({});
    const itunesApi = 'https://itunes.apple.com/search?term=';
    const urlEndPoint = {
        'artist': '&media=music&entity=musicArtist&attribute=artistTerm',
        'collection': '&media=music&entity=album&attribute=albumTerm',
        'track': '&media=music&entity=song&attribute=songTerm'
    };

    const searchMediaCategory = (searchText) => {
        Object.keys(urlEndPoint).forEach((endPoint) => {
            searchApi(searchText, urlEndPoint[endPoint], endPoint);
        });
    }

    const getMoreMediaInfo = async (searchText) => {
        await searchApi(searchText);
    }
    
    const searchApi = (searchText, apiEndPoint, mediaName) => {
        let url = itunesApi + searchText;   
        if (apiEndPoint) {
            url = url + apiEndPoint;
        }     
        axios
            .get(url)
            .then(response => {
                if (mediaName) {
                    filterCategory(response.data.results, mediaName);
                } else{ 
                    allMedia['musicDetails'] = response.data.results;
                }
            })
            .catch(error => {
                console.log("error getting data", error);
            });
    }

    const filterCategory = (data, mediaName)=>{
        const newSearchResult = new Set();
        allMediaCategory[mediaName] = data.filter(el => {
            const duplicate = newSearchResult.has(el[mediaName + 'Name'].toLowerCase());
            newSearchResult.add(el[mediaName + 'Name'].toLowerCase());
            return !duplicate;
        });
    }
    
    return {
        allMediaCategory,
        allMedia,
        searchMediaCategory,
        getMoreMediaInfo
    }
}