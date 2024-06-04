package com.example.TrabajoPractico9.repositories;

import com.example.TrabajoPractico9.entities.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

@NoRepositoryBean
public interface BaseRepository <T extends BaseEntity,ID extends Serializable> extends JpaRepository<T,ID> {
}
