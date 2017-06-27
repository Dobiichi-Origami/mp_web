const Plugin = {
	state: {
		//seeimg组件
		img_show: false,
		img_index: -1,
		img_photos: false,
		photos_show: [],
		see_img: function (state, index, photos) {
			state.img_show = true;
			state.img_index = index;
			state.img_photos = photos;
			state.photos_show[state.img_index] = true;
		},
		//error组件
		show_error: false,
		error: '',
		f_error: function (state, data) {
			state.error = data;
			state.show_error = true;
		},
		//select-pi组件
		show_select_pi: false,
		pi_index: 0,
		f_add_pi: function (state, index) {
			state.pi_index = index;
			state.show_select_pi = true;
		},
	}
}
export default Plugin;
