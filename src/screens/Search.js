import React from 'react'
import { View } from 'react-native'
import styles from '../styles'

const Search = () => {
  return (
    <View>
        <View style={styles.searchBar}>
        <TextInput
          value={searchText}
          onChangeText={e => setSearchText(e)}
          style={searching ? styles.searchInputFocused : styles.searchInput}
          onFocus={() => setSearching(true)}
          onBlur={() => setSearching(false)}
          selectionColor="#000"
        />
        <TouchableOpacity
          onPress={() => searchText.length > 0 && setSearched(true)}
          style={styles.searchBtn}>
          <FontAwesomeIcon
            style={{color: '#000', marginRight: 10}}
            icon={faSearch}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Search