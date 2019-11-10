//Property Dialog for single elements of the mockup
usemockups.views.PropertyDialog = Backbone.View.extend({
    el: "footer form",
    template: $("#property-form-template").html(),
    events: {
        'submit': 'submit',
        'click .send-to-back': 'send_to_back',
        'click .bring-to-front': 'bring_to_front',
		'click .center-item': 'center_item'
    },
    initialize: function () {
        this.on("update_for_attribute", this.update_for_attribute);
        this.on("update_for_sizes", this.update_for_sizes);
        this.model.on("destroy", this.hide, this);
        this.footer = $("footer");
    },
    render: function () {

        this.footer.show();
        this.$el.html(_.template(this.template, {
            "attributes": this.get_attributes()
        })).find("input").change(function (ui) {


            var input = $(ui.target);
            var value;

            if (input.is(":checkbox")) {
                value = input.is(":checked");
            } else {
                value = input.val();
            }

            this.model.set(input.attr("name"), value);

        }.bind(this));

        this.$el.find("a.delete").click(function () {
            this.destroy();
            return false;
        }.bind(this));

        return this;
    },
    set_measuredSizes: function (measuredSizes){
      this.measuredSizes = measuredSizes;
      return this;
    },
    update_for_attribute: function (field) {
        this.$el.find("#id_"  + field.data("attribute")).val(field.val());
    },
    update_for_sizes: function (size) {
        if (this.model.has("height"))
            this.$el.find("#id_height").val(size.height);
        if (this.model.has("width"))
            this.$el.find("#id_width").val(size.width);
    },
    get_attributes: function () {
        return _.map(this.model.tool.get("attributes"), function (attribute) {
            var value = this.model.get(attribute.name);
            // makes sure the input is escaped if it's a string
            if (typeof value === 'string' || value instanceof String) {
                value = value.replace(/"/g, '&quot;');
            }
            return _.extend({
                "value": value
            }, attribute);
        },this)
    },
    hide: function () {
        this.footer.hide();
    },
    destroy: function () {
        this.model.destroy();
        return false;
    },
    submit: function () {
        this.hide();
        return false;
    },
	center_item: function () {
        var documentWidth = usemockups.active_document_view.model.attributes.width;
        var left = Math.floor((documentWidth - this.measuredSizes.width) / 2);
		this.model.set({
			"left":  left
		});

		return false;
	},
    send_to_back: function () {
        this.model.set({
            "z_index":  usemockups.views.Mockup.prototype.min_z_index
        });
        _.forEach(usemockups.active_document_view.model.mockups.models, function (mockup) {
            mockup.set("z_index", mockup.get("z_index") + 1);
        }, this);
        return false;
    },
    bring_to_front: function () {
        this.model.set({
            "z_index":  usemockups.views.Mockup.prototype.max_z_index + 1
        });
        return false;
    }

});
