import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout/Layout';
import initialContacts from './contacts.json';
import { Component } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { nanoid } from 'nanoid';
export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts !== null) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    } else {
      this.setState({ contacts: initialContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  addContact = (contact, name) => {
    if (this.state.contacts.find(contact => contact.name === name)) {
      alert(`${name} is already in contacts.`);
      return;
    } else {
      const newContact = { ...contact, id: nanoid() };
      const updateContacts = [...this.state.contacts, newContact];
      this.setState({
        contacts: updateContacts,
      });
    }
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  getVisiblesContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const visibleContacts = this.getVisiblesContacts();
    return (
      <Layout>
        <h1>Phonebook</h1>
        <ContactForm onSave={this.addContact} />
        <h2>Contacts</h2>
        <Filter value={this.state.filter} onChange={this.changeFilter} />
        <ContactList items={visibleContacts} onDelete={this.deleteContact} />

        <GlobalStyle />
      </Layout>
    );
  }
}
