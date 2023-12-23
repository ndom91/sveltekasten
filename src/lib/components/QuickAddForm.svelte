<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { formSchema, type FormSchema } from "../../routes/schema";
  import type { SuperValidated } from "sveltekit-superforms";

  export let form: SuperValidated<FormSchema>;
</script>

<Form.Root {formSchema} {form} let:config>
  <Form.Field {config} name="title">
    <Form.Item>
      <Form.Label />
      <Form.Input />
      <Form.Description />
      <Form.Validation />
    </Form.Item>
  </Form.Field>
</Form.Root>
