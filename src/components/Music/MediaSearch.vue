<template>
    <div class="flex justify-center">
        <div class="main-section">
            <span class="italic font-bold text-xl">Music Search</span>
            <div class="relative">
                <div class="mt-2 top-0 left-0 right-0">
                    <span class="absolute flex m-2 search-icon">
                    </span>
                    <input class="w-full placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-lg py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 sm:text-sm" :class="[mediaCategory !== '' && !isMoreDetailLoaded ? 'rounded-t-lg' : 'rounded-md']"  placeholder="Search here..." type="text" v-model="mediaCategory"
                        @input="debounceMediaCategories"/>
                    <span  v-if="isSearchingMedia && !isMoreDetailLoaded" class="loading-icon text-xl m-2 right-0 top-0 absolute animate-spin"></span>
                </div>
                <div v-if="mediaCategory !== '' && !isMoreDetailLoaded" class="overflow-auto border rounded-b-lg">
                    <div v-if="allMediaCategory.artist && allMediaCategory.artist.length == 0 && allMediaCategory.collection && allMediaCategory.collection.length == 0 && allMediaCategory.track && allMediaCategory.track.length == 0" class="p4 h-10">
                        Oops... No result found.
                    </div>
                    <div v-else class="h-80">
                        <div v-if="allMediaCategory.artist && allMediaCategory.artist.length > 0" class="text-left p-4">
                            <span><b>Artist</b></span>
                            <ul>
                                <li v-for="artist in allMediaCategory.artist" :key="artist.artistId" @click="getMoreDetailbySelectedValue(artist.artistName);">{{ artist.artistName }}</li>
                            </ul>
                        </div>
                        <div v-if="allMediaCategory.collection && allMediaCategory.collection.length > 0" class="text-left p-4">
                            <span><b>Album</b></span>
                            <ul>
                                <li v-for="collection in allMediaCategory.collection" :key="collection.collectionId" @click="getMoreDetailbySelectedValue(collection.collectionName);">{{ collection.collectionName }}</li>
                            </ul>
                        </div>
                        <div v-if="allMediaCategory.track && allMediaCategory.track.length > 0" class="text-left p-4">
                            <span><b>Song</b></span>
                            <ul>
                                <li v-for="track in allMediaCategory.track" :key="track.trackId" @click="getMoreDetailbySelectedValue(track.trackName);">{{ track.trackName }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="allMedia.musicDetails && allMedia.musicDetails.length > 0" class="space-y-4 mt-2">
                <div class="bg-white rounded-md border overflow-hidden h-24" v-for="music in allMedia.musicDetails" :key="music.trackId">
                    <div class="flex h-full">
                        <img class="h-full" :src="music.artworkUrl60" alt="No image">
                        <div class="text-left pl-2 py-3">
                            <div class="text-sm font-semibold">{{music.trackName}} - {{music.artistName}}</div>
                            <p class="text-slate-500 text-xs">Released on {{music.releaseDate}} Album {{music.collectionName}}</p>
                            <a :href="music.trackViewUrl" class="text-blue-600 text-sm hover:underline block mt-3" target="_blank">view in iTunes</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import debounce from 'lodash/debounce';
import useMediaService from "../../services/MediaService";

export default {
  name: 'MediaSearch',
  setup() {
    const { allMediaCategory, allMedia, searchMediaCategory, getMoreMediaInfo } = useMediaService();
    const mediaCategory = ref('');
    const isSearchingMedia = ref(false);
    const isMoreDetailLoaded =  ref(false);
  
    const debounceMediaCategories =  debounce(async () => {
        await searchMediaCategory(mediaCategory.value.trim().replace(/\s/g, '+'));
        isSearchingMedia.value = false;
        isMoreDetailLoaded.value = false;
    }, 200);

    const getMoreDetailbySelectedValue = async(searchText)=>{
        mediaCategory.value = searchText;
        await getMoreMediaInfo(searchText.replace(/\s/g, '+'));
        isMoreDetailLoaded.value = true;
    }

    watch(()=>mediaCategory.value, ()=> {
        isSearchingMedia.value = true;
    });
    
    return {
      mediaCategory,
      debounceMediaCategories,
      allMediaCategory,
      isSearchingMedia,
      isMoreDetailLoaded,
      getMoreDetailbySelectedValue,
      allMedia
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .search-icon {
        background: url('./../../assets/icons/search.svg');
        background-size: cover;
        width: 20px;
        height: 20px;
    }
    .loading-icon {
        background: url('./../../assets/icons/loader.svg');
        background-size: cover;
        width: 20px;
        height: 20px;
    }
    .main-section {
        width: 60%;
    }
</style>
